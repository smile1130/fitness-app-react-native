import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { green, mainColor, mainColorDark, white } from '../../styles/colors';
import { CommonStyles } from '../../styles/CommonStyles';
import EmptySection from '../common/EmptySection';
import { Strings } from '../../config/Strings';
import { Spinner } from '../common/Spinner';
import { useNavigation } from '@react-navigation/native';
import ShoppingListService from '../../services/ShoppingListService';
import CustomButton from '../common/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import ComponentWithBackground from '../common/ComponentWithBackground';
import TitleComponent from '../common/TitleComponent';
import CustomButtonIcon from '../common/CustomButtonIcon';
import InputBorder from '../common/InputBorder';
import CustomModal from '../common/CustomModal';
import CustomSwitch from '../common/CustomSwitch';

class ShoppingList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shopping_list: null,
            modalAddVisible: false,
            newFoodName: null,
            newFoodAvailable: false
        };

        this.preRenderRefreshControl = this.renderRefreshControl();
    }

    componentDidMount() {
        this.loadShoppingList();
    }

    renderRefreshControl = () => {
        return <RefreshControl refreshing={false} onRefresh={this.loadShoppingList} colors={[mainColor, mainColorDark]} />
    }

    loadShoppingList = () => {
        ShoppingListService.shoppingList()
        .then(data => {
            this.setState({
                shopping_list: data.shoppingList
            });
        }).catch(null);
    }

    renderEmptyNutritionalAdvices = () => {
        return (
            <EmptySection text={Strings.strings_empty_shopping_list} icon={'images'} />
        )
    }

    setToggleCheckBox = (item) => {
        ShoppingListService.toggleShoppingList(item.id).then(() => {
            this.loadShoppingList();
        });
    }

    handleBack = () => {
        this.props.navigation.goBack();
    }

    deleteFood = (item) => {
        ShoppingListService.deleteShoppingList(item.id).then(
            () => {
                let newItems = this.state.shopping_list;

                newItems = newItems.filter(food => food.id !== item.id);

                this.setState({
                    shopping_list: [...newItems]
                });
            }
        );
    }

    renderRightActions = (progress, dragX, item) => {
        const zoomAnimation = dragX.interpolate({
          inputRange: [-1000, -50, 0],
          outputRange: [2, 1, 0.5]
        })
        return (
            <TouchableOpacity onPress={() => this.deleteFood(item)}>
                <View
                    style={styles.mainContainerDelete}
                >
                    <Animated.Text
                        style={[styles.containerDelete, {transform: [{ scale: zoomAnimation }]}]}
                    >
                        <Icon
                            name={'trash-outline'}
                            size={scale(26)}
                        />
                    </Animated.Text>
                </View>
            </TouchableOpacity>
        )
       }

    renderItem = (item, index) => {
        const {
            boxShadowLight
        } = CommonStyles;

        return (
            <Swipeable
                renderRightActions={(progress, dragX) => this.renderRightActions(progress, dragX, item)}
                containerStyle={styles.mainContainerItem}
                key={item.id}
            >
                <View style={[boxShadowLight, styles.containerItem]}>
                    <View style={styles.containerItemInner}>
                        <Text style={[CommonStyles.text14, CommonStyles.textBold]}>{item.name}</Text>
                        <View>
                            <View style={styles.containerCheckbox}>
                                <CustomButtonIcon
                                    onPress={() => this.setToggleCheckBox(item)}
                                    icon={item.available ? 'refresh-outline' : 'cart-outline'}
                                    bgColor={item.available ? green : mainColor}
                                    iconStyle={{ marginRight: item.available ? 0 : scale(2) }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Swipeable>
        )
    }

     renderModalAddFood = () => {
        const handleCancel = () => {
            this.setState({
                newFoodName: null,
                newFoodAvailable: false,
                modalAddVisible: false
            });
        };
        
        const handleCreate = () => {
            this.setState({ modalAddVisible: false });

            const params = {
                name: this.state.newFoodName,
                available: this.state.newFoodAvailable ? 1 : 0,
            };

            ShoppingListService.storeShoppingList(params)
            .then(data => {
                this.setState({
                    shopping_list: data.shoppingList,
                    newFoodName: null,
                    newFoodAvailable: false,
                });
            }).catch(null);

        };

        return (
            <CustomModal
                visible={this.state.modalAddVisible}
                title={Strings.label_add_new_food}
                onCancel={handleCancel}
                onConfirm={handleCreate}
                confirmText={Strings.label_add}
                confirmIcon='restaurant-outline'
            >
                <InputBorder
                    placeholder={Strings.label_insert_food_name}
                    text={this.state.newFoodName}
                    handleValue={(newFoodName) => {this.setState({newFoodName})}}
                    autoCapitalize
                />
                <CustomSwitch
                    label={Strings.label_purchased}
                    handleValue={(newFoodAvailable) => this.setState({ newFoodAvailable })}
                    value={this.state.newFoodAvailable}
                />
            </CustomModal>
        )
    }

    renderAddFood = () => {
        return (
            <CustomButton
                onPress={() => this.setState({ modalAddVisible: true })}
                text={Strings.label_add_new_food}
                isAbsolute
                icon={'restaurant-outline'}
            />
        )
    }

    renderHeader = () => {
        return (
            <TitleComponent
                title={Strings.label_shopping_list}
                handleBack={this.handleBack}
            />
        );
    };

    renderNotAvailable = () => {
        const {
            text18,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerList}>
                <Text style={[text18, textBold, styles.textTitle]}>{Strings.label_to_buy}</Text>
                {
                    this.state.shopping_list.filter(innerItem => !innerItem.available).map((item, index) => (
                        this.renderItem(item, index)
                    ))
                }
            </View>
        )
    }

    renderAvailable = () => {
        const {
            text18,
            textBold
        } = CommonStyles;

        return (
            <View style={styles.containerList}>
                <Text style={[text18, textBold, styles.textTitle]}>{Strings.label_purchased}</Text>
                {
                    this.state.shopping_list.filter(innerItem => innerItem.available).map((item, index) => (
                        this.renderItem(item, index)
                    ))
                }
            </View>
        )
    }

    renderLists = () => {
        if (this.state.shopping_list.length === 0) {
            return this.renderEmptyNutritionalAdvices();
        }

        return (
            <View>
                { this.renderNotAvailable() }
                { this.renderAvailable() }
            </View>
        )
    }

    render() {
        if(!this.state.shopping_list) {
            return <Spinner />
        }

        return (
            <ComponentWithBackground safeAreaEnabled>
                <ScrollView
                    refreshControl={this.preRenderRefreshControl}
                    contentContainerStyle={styles.list}
                >
                    { this.renderHeader() }
                    { this.renderLists() }
                </ScrollView>
                { this.renderAddFood() }
                { this.renderModalAddFood() }
            </ComponentWithBackground>
        );
    }
}

const styles = ScaledSheet.create({
    list: {
        flexGrow: 1,
        paddingBottom: '70@s'
    },
    containerList: {
        marginBottom: '15@s'
    },
    containerItem: {
        flexDirection: 'row',
        padding: '5@s',
        marginVertical: '8@s',
        backgroundColor: white,
        borderRadius: '10@s'
    },
    textTitle: {
        marginBottom: '15@s',
        marginHorizontal: '15@s'
    },
    mainContainerItem: {
        paddingHorizontal: '15@s'
    },
    containerItemInner: {
        padding: '10@s',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerCheckbox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mainContainerDelete: {
        flex: 1,
        backgroundColor: mainColor,
        justifyContent: 'center',
        borderRadius: '10@s',
        marginRight: '25@s',
        marginVertical: '8@s'
    },
    containerDelete: {
        color: white,
        paddingHorizontal: '15@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <ShoppingList {...props} navigation={navigation} />;
};