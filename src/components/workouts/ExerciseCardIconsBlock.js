import React, { PureComponent } from 'reactn';
import {
    View,
    Text
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonStyles } from '../../styles/CommonStyles';
import { mainColor, mainColorLight } from '../../styles/colors';
import { Strings } from '../../config/Strings';
import { useNavigation } from '@react-navigation/native';

class ExerciseCardIconsBlock extends PureComponent {
    render() {
        const {
            text14,
            text11,
            text16,
            text10,
            darkGrayText,
            textBold,
            whiteText,
            textCenter
        } = CommonStyles;

        const iconSize = this.props.small ? scale(12) : scale(18);
        const circleElementExtra = this.props.small ? styles.circleElementSmall : null;
        const textExtra = this.props.small ? text11 : text16;
        const textColor = this.props.whiteText ? whiteText : darkGrayText;
        const textColorSubtitle = this.props.whiteText ? whiteText : darkGrayText;
        const innerBlock = this.props.small ? styles.innerInfoBlockSmall : styles.innerInfoBlock;
        const containerInnerBlock = this.props.small ? styles.containerInnerInfoSmall : styles.containerInnerInfo;
        const type = this.props.exercise.final_type || this.props.exercise.type;

        return (
            <View>
                <View style={containerInnerBlock}>
                    {
                        type !== 'ramp' &&
                            <View style={innerBlock}>
                                {
                                    !this.props.hideIcon &&
                                        <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                            <Icon
                                                name={'refresh-outline'}
                                                size={iconSize}
                                                color={mainColor}
                                            />
                                        </View>
                                }
                                <Text style={[textColor, textExtra, textBold]}>{this.props.exercise.sets || '-'}</Text>
                                <Text style={[text10, textColorSubtitle]}>{Strings.label_set}</Text>
                            </View>
                    }
                    <View style={innerBlock}>
                        {
                            !this.props.hideIcon &&
                                <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                    <Icon
                                        name={(type === 'reps' || type === 'ramp') ? 'barbell-outline' : 'time-outline'}
                                        size={iconSize}
                                        color={mainColor}
                                    />
                                </View>
                        }
                        <Text style={[textColor, text10]}>
                            <Text style={[textExtra, textBold, textCenter]}>
                                {this.props.exercise.final_value || '-'}
                            </Text>
                            {(type !== 'reps' && type !== 'ramp') ?
                                (type === 'minutes' ? ' ' + Strings.label_min : ' ' + Strings.label_sec)
                                : null
                            }
                        </Text>
                        <Text style={[text10, textColorSubtitle]}>
                            {type === 'reps' ? Strings.label_reps : ( type === 'ramp' ? Strings.label_ramp : Strings.label_time)}
                        </Text>
                    </View>
                    {
                        !this.props.hideRest &&
                            <View style={innerBlock}>
                                {
                                    !this.props.hideIcon &&
                                        <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                            <Icon
                                                name={'hourglass-outline'}
                                                size={iconSize}
                                                color={mainColor}
                                            />
                                        </View>
                                }
                                <Text style={[textColor, text10]}>
                                    <Text style={[textExtra, textBold]}>
                                        {this.props.exercise.restType === 'no_rest' ? '0' : this.props.exercise.restValue}
                                    </Text>
                                    {this.props.exercise.restType !== 'no_rest' ?
                                        (this.props.exercise.restType === 'minutes' ? ' ' + Strings.label_min : ' ' + Strings.label_sec)
                                        : null
                                    }
                                </Text>
                                <Text style={[text10, textColorSubtitle]}>{Strings.label_rest}</Text>
                            </View>
                    }
                    {
                        !this.props.small && this.props.exercise.rpe &&
                            <View style={innerBlock}>
                                <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                    <Icon
                                        name={'flame'}
                                        size={iconSize}
                                        color={mainColor}
                                    />
                                </View>
                                <Text style={[textColor, textExtra, textBold]}>{this.props.exercise.rpe || '-'}</Text>
                                <Text style={[text10, textColorSubtitle]}>RPE</Text>
                            </View>
                    }
                    {
                        !this.props.small && this.props.exercise.rir &&
                            <View style={innerBlock}>
                                <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                    <Icon
                                        name={'battery-half'}
                                        size={iconSize}
                                        color={mainColor}
                                    />
                                </View>
                                <Text style={[textColor, textExtra, textBold]}>{this.props.exercise.rir || '-'}</Text>
                                <Text style={[text10, textColorSubtitle]}>RIR</Text>
                            </View>
                    }
                    {
                        !this.props.small && this.props.exercise.tut &&
                            <View style={innerBlock}>
                                <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                    <Icon
                                        name={'time-outline'}
                                        size={iconSize}
                                        color={mainColor}
                                    />
                                </View>
                                <Text style={[textColor, textExtra, textBold]}>{this.props.exercise.tut || '-'}</Text>
                                <Text style={[text10, textColorSubtitle]}>TUT</Text>
                            </View>
                    }
                </View>
                {
                    !this.props.small && this.props.exercise.weight &&
                        <View style={innerBlock}>
                            <Text style={[text14, textColor, textBold, styles.weightContainer]}>PESO</Text>
                            <View style={[styles.circleElement, styles.circleElementMedium, circleElementExtra]}>
                                <Icon
                                    name={'barbell-outline'}
                                    size={iconSize}
                                    color={mainColor}
                                />
                            </View>
                            <Text style={[textColor, textExtra, textBold]}>{this.props.exercise.weight || '-'}</Text>
                        </View>
                }
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    circleElement: {
        width: '30@s',
        height: '30@s',
        borderRadius: '15@s',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '6@s'
    },
    circleElementSmall: {
        width: '20@s',
        height: '20@s',
        borderRadius: '10@s',
    },
    circleElementMedium: {
        backgroundColor: mainColorLight
    },
    innerInfoBlock: {
        flexBasis: '33%',
        alignItems: 'center',
        marginTop: '20@s'
    },
    innerInfoBlockSmall: {
        alignItems: 'center'
    },
    containerInnerInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    containerInnerInfoSmall: {
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    weightContainer: {
        marginBottom: '7@s'
    }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <ExerciseCardIconsBlock {...props} navigation={navigation} />;
}