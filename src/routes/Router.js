import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AuthStack } from './AuthStack';
import { useAuth } from '../contexts/Auth';
import { AppStack } from './AppStack';
import { navigationRef } from '../config/RootNavigation';
import { white } from '../styles/colors';

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: white
	},
};

export const Router = () => {
	const { authData, loading } = useAuth();

	if (loading) {
		return null;
	}

	return (
		<NavigationContainer ref={navigationRef} theme={MyTheme}>
			{authData ? <AppStack /> : <AuthStack />}
		</NavigationContainer>
	);
};