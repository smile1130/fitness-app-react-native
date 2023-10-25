import React, { useMemo, useState } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { gray, gray2, mainColor } from '../../styles/colors';
import { scale } from 'react-native-size-matters';
import { CommonStyles } from '../../styles/CommonStyles';

const CustomRadioGroups = ({
    options,
    handlePress,
    defaultSelected = null,
    disabled = false
}) => {
    const {
        darkGrayText,
        text12
    } = CommonStyles;

    const radioButtons = useMemo(() => (options.map((obj, index) => ({
        ...obj,
        id: index,
        borderColor: disabled ? ( defaultSelected === index ? mainColor : gray ) : mainColor,
        color: mainColor,
        containerStyle: { marginHorizontal: 0, marginTop: index === 0 ? 0 : scale(12) },
        size: scale(16),
        borderSize: scale(1),
        labelStyle: {...darkGrayText, ...text12}
    }))), []);

    const [selectedId, setSelectedId] = useState(defaultSelected);

    function onPressSelectedId(id) {
        if (disabled) {
            return;
        }

        setSelectedId(id);
        handlePress(options.find((obj, index) => index == id));
    }

    return (
        <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressSelectedId}
            selectedId={selectedId}
            containerStyle={{ alignItems: 'flex-start'}}
        />
    );
}

export default CustomRadioGroups;
