import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';
import CustomButton from './CustomButton';

class ResponseMessage extends PureComponent {
    render() {
        const {
            textTitle,
            text13,
            textCenter
        } = CommonStyles;
        
        return (
            <View style={styles.container}>
                <Text style={[textTitle, textCenter]}>{this.props.title || ""}</Text>

                {!!this.props.description && <Text style={[styles.desc, text13, textCenter]}>{this.props.description}</Text>}
                
                {!!this.props.hasButton && (
                    <CustomButton 
                        text={this.props.buttonText || ""} 
                        containerStyle={styles.button} 
                        onPress={this.props.onButtonPress} 
                    />
                )}
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '30@s',
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc: {
        marginTop: '5@s'
    },
    button: {
        marginTop: '20@s',
    },
});

export default ResponseMessage;
