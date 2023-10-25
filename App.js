import React, { useState, useEffect } from 'reactn';
import { useGlobal } from 'reactn';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { initOneSignal } from './src/config/OneSignal';
import { getUserDataAsync, setUserData, setToken } from './src/config/Util';
import { AuthProvider } from './src/contexts/Auth';
import { Router } from './src/routes/Router';
import InitialStateProvider from './src/contexts/InitialStateProvider';
import { MenuProvider } from 'react-native-popup-menu';
import CustomBackgroundTimer from './src/components/common/CustomBackgroundTimer';
import { GLOBAL_ACTIVE_KEEP_AWAKE } from './src/state/StateInitializer';
import KeepAwake from 'react-native-keep-awake';

export default function App() {
	const [keepAwakeActivated, setKeepAwakeActivated] = useState(false);
    const [activeKeepAwake] = useGlobal(GLOBAL_ACTIVE_KEEP_AWAKE);

	useEffect(() => {
		SplashScreen.hide();
		bootstrapAsync();
	})

	useEffect(() => {
		if (activeKeepAwake) {
			KeepAwake.activate();
			setKeepAwakeActivated(true);
		} else {
			KeepAwake.deactivate();
			setKeepAwakeActivated(false);
		}
	}, [activeKeepAwake])

	const bootstrapAsync = async () => {
		let userToken;
	
		try {
			const userData = await getUserDataAsync();
			setUserData(userData);
			userToken = userData ? userData.access_token : null;
		} catch (e) {
			console.log('ERROR GET TOKEN', e);
		}
	
		setToken(userToken);

		// Init OneSignal
		initOneSignal();
	};

	return (
		<View style={{flex: 1}}>
			<MenuProvider>
				<AuthProvider>
					<InitialStateProvider>
						<Router />
					</InitialStateProvider>
				</AuthProvider>
			</MenuProvider>
			<CustomBackgroundTimer />
			{keepAwakeActivated && <KeepAwake />}
		</View>
	);
}

