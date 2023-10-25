import React, { PureComponent } from 'react';
import {
    Linking
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { screenWidth } from '../../config/Util';
import { CommonStyles } from '../../styles/CommonStyles';

class HtmlCustom extends PureComponent {
    constructor(props) {
        super(props);

        this.tagsStyles = {
            ol: {
                margin: 0
            },
            ul: {
                margin: 0
            },
            p: {
                margin: 0
            },
            h1: {
                margin: 0
            },
            h2: {
                margin: 0
            },
            h3: {
                margin: 0
            },
            h4: {
                margin: 0
            },
            h5: {
                margin: 0
            },
            h6: {
                margin: 0
            }
        };
    };
    
    render() {
        const {
            text13
        } = CommonStyles;

        return (
            <RenderHtml
                contentWidth={screenWidth}
                baseStyle={this.props.baseFontStyle || text13}
                source={{ html: this.props.html }}
                renderersProps={{
                    a: {
                        onPress: (_, href) => {
                        Linking.openURL(href)
                        },
                    },
                }}
                tagsStyles={this.tagsStyles}
            />
        )
    }
}

export default HtmlCustom;