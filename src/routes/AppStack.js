import React from 'react';
import { getGlobal } from 'reactn';
import { createStackNavigator } from '@react-navigation/stack';
import { isAndroid } from '../config/Util';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { gray, mainColor } from '../styles/colors';
import WorkoutsList from '../components/workouts/WorkoutsList';
import WorkoutDetail from '../components/workouts/WorkoutDetail';
import Programs from '../components/workouts/Programs';
import Chat from '../components/chat/Chat';
import Metrics from '../components/results/metrics/Metrics';
import NewResult from '../components/results/metrics/NewResult';
import MetricHistory from '../components/results/metrics/MetricHistory';
import NewProgress from '../components/media/NewProgress';
import Progress from '../components/media/Progress';
import AppVersion from '../components/common/AppVersion';
import { scale } from 'react-native-size-matters';
import Medias from '../components/media/Medias';
import { Text } from 'react-native';
import { CommonStyles } from '../styles/CommonStyles';
import Profile from '../components/profile/Profile';
import Notifications from '../components/notifications/Notifications';
import TabIcon from '../components/common/TabIcon';
import ChatDotProvider, { ChatDotContext } from '../contexts/ChatDotProvider';
import WeightsHistory from '../components/workouts/weights/WeightsHistory';
import NewWeight from '../components/workouts/weights/NewWeight';
import { InitialStateContext } from '../contexts/InitialStateProvider';
import { Strings } from '../config/Strings';
import {
	GLOBAL_ACTIVE_USER,
	GLOBAL_FORCE_LOGOUT,
} from '../state/StateInitializer';
import Reservations from '../components/reservations/Reservations';
import Reminders from '../components/reminders/Reminders';
import ReservationDetail from '../components/reservations/ReservationDetail';
import ShoppingList from '../components/nutrition/ShoppingList';
import MealPlan from '../components/nutrition/MealPlan';
import Macro from '../components/nutrition/Macro';
import NutritionalAdvice from '../components/nutrition/NutritionalAdvice';
import VisitHistory from '../components/results/visits/VisitHistory';
import CompareImagesModal from '../components/common/CompareImagesModal';
import WeightHistoryDetail from '../components/workouts/weights/WeightHistoryDetail';
import Surveys from '../components/surveys/Surveys';
import Home from '../components/Home';
import Weights from '../components/results/weights/Weights';
import MacrosList from '../components/nutrition/MacrosList';
import MealPlansList from '../components/nutrition/MealPlansList';
import MealPlanInfo from '../components/nutrition/MealPlanInfo';
import SurveyForm from '../components/surveys/SurveyForm';
import VideoTrimmer from '../components/media/VideoTrimmer';
import MediaFullScreen from '../components/common/MediaFullScreen';

const Stack = createStackNavigator();
const HSScreen = createStackNavigator();
const CSScreen = createStackNavigator();
const NSScreen = createStackNavigator();
const RSScreen = createStackNavigator();
const PSScreen = createStackNavigator();
const TabStack = createBottomTabNavigator();

export const HomeStackScreen = () => {
	return (
		<HSScreen.Navigator>
			{/* Workouts */}
			<HSScreen.Screen
				name="Home"
				component={Home}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="WorkoutsList"
				component={WorkoutsList}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="WorkoutDetail"
				component={WorkoutDetail}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="Programs"
				component={Programs}
				options={{ headerShown: false }}
			/>

			{/* Weights */}
			<HSScreen.Screen
				name="WeightsHistory"
				component={WeightsHistory}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="WeightHistoryDetail"
				component={WeightHistoryDetail}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="NewWeight"
				component={NewWeight}
				options={{ headerShown: false }}
			/>

			{/* Nutrition */}
			<HSScreen.Screen
				name="MealPlansList"
				component={MealPlansList}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="MacrosList"
				component={MacrosList}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="NutritionalAdvice"
				component={NutritionalAdvice}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="ShoppingList"
				component={ShoppingList}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="MealPlan"
				component={MealPlan}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="MealPlanInfo"
				component={MealPlanInfo}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="Macro"
				component={Macro}
				options={{ headerShown: false }}
			/>

			{/* Results */}
			<HSScreen.Screen
				name="Weights"
				component={Weights}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="Metrics"
				component={Metrics}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="Progress"
				component={Progress}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="NewProgress"
				component={NewProgress}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="NewResult"
				component={NewResult}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="MetricHistory"
				component={MetricHistory}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="VisitHistory"
				component={VisitHistory}
				options={{ headerShown: false }}
			/>

			{/* Prenotazioni */}
			<HSScreen.Screen
				name="Reservation"
				component={Reservations}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="ReservationDetail"
				component={ReservationDetail}
				options={{ headerShown: false }}
			/>

			<HSScreen.Screen
				name="Surveys"
				component={Surveys}
				options={{ headerShown: false }}
			/>
			<HSScreen.Screen
				name="SurveyForm"
				component={SurveyForm}
				options={{ headerShown: false }}
			/>
		</HSScreen.Navigator>
	);
};

export const ChatStackScreen = () => {
	return (
		<CSScreen.Navigator>
			<CSScreen.Screen
				name="Chat"
				component={Chat}
				options={{ headerShown: false }}
			/>
			<CSScreen.Screen
				name="Medias"
				component={Medias}
				options={{ headerShown: false }}
			/>
		</CSScreen.Navigator>
	);
};

export const NotificationStackScreen = () => {
	return (
		<NSScreen.Navigator>
			<NSScreen.Screen
				name="Notifications"
				component={Notifications}
				options={{ headerShown: false }}
			/>
		</NSScreen.Navigator>
	);
};

export const ReminderStackScreen = () => {
	return (
		<RSScreen.Navigator>
			<RSScreen.Screen
				name="Reminders"
				component={Reminders}
				options={{ headerShown: false }}
			/>
		</RSScreen.Navigator>
	);
};

export const ProfileStackScreen = () => {
	return (
		<PSScreen.Navigator>
			<HSScreen.Screen
				name="Profile"
				component={Profile}
				options={{ headerShown: false }}
			/>
		</PSScreen.Navigator>
	);
};

const onTabPress = (e, routeName, initialState) => {
	const forceLogout = getGlobal()[GLOBAL_FORCE_LOGOUT];

	if (forceLogout) {
		initialState.forceLogout();
		e.preventDefault();
	}

	const isActiveUser = getGlobal()[GLOBAL_ACTIVE_USER];

	if (!isActiveUser && routeName !== 'Chat') {
		initialState.updateIsActiveModalVisible(isActiveUser);
		e.preventDefault();
	}
};

export const TabClientStackScreen = () => {
	return (
		<InitialStateContext.Consumer>
			{initialState => (
				<ChatDotProvider showDot={initialState.hasUnreadMessages}>
					<ChatDotContext.Consumer>
						{chatContext => (
							<TabStack.Navigator
								initialRouteName="Home"
								screenOptions={({ route }) => ({
									tabBarIcon: ({ focused, color, size }) => {
										let iconName;

										if (route.name === 'Home') {
											iconName = focused ? 'grid' : 'grid-outline';
										} else if (route.name === 'Chat') {
											iconName = focused
												? 'chatbubbles'
												: 'chatbubbles-outline';
										} else if (route.name === 'Reminders') {
											iconName = focused ? 'calendar' : 'calendar-outline';
										} else if (route.name === 'Profile') {
											iconName = focused
												? 'person-circle'
												: 'person-circle-outline';
										} else {
											iconName = focused
												? 'notifications'
												: 'notifications-outline';
										}

										return (
											<TabIcon
												name={iconName}
												size={scale(19)}
												color={color}
												showDot={route.name === 'Chat' && chatContext.showDot}
											/>
										);
									},
									tabBarLabel: ({ focused, color }) => {
										let tabLabel;

										if (route.name === 'Home') {
											tabLabel = 'Home';
										} else if (route.name === 'Chat') {
											tabLabel = 'Chat';
										} else if (route.name === 'Reminders') {
											tabLabel = Strings.label_reminders;
										} else if (route.name === 'Profile') {
											tabLabel = Strings.label_profile;
										} else {
											tabLabel = Strings.label_notifications;
										}

										return (
											<Text
												style={[
													CommonStyles.text10,
													focused
														? CommonStyles.mainText
														: CommonStyles.grayText,
													focused
														? CommonStyles.textBold
														: CommonStyles.textRegular,
												]}>
												{tabLabel}
											</Text>
										);
									},
								})}
								tabBarOptions={{
									keyboardHidesTabBar: isAndroid,
									activeTintColor: mainColor,
									inactiveTintColor: gray
								}}>
								<TabStack.Screen
									name="Profile"
									component={ProfileStackScreen}
									listeners={{
										tabPress: e => onTabPress(e, 'Profile', initialState),
									}}
								/>
								<TabStack.Screen
									name="Reminders"
									component={ReminderStackScreen}
									listeners={{
										tabPress: e => onTabPress(e, 'Reminders', initialState),
									}}
								/>
								<TabStack.Screen
									name="Home"
									component={HomeStackScreen}
									listeners={{
										tabPress: e => onTabPress(e, 'Home', initialState),
									}}
								/>
								<TabStack.Screen
									name="Chat"
									component={ChatStackScreen}
									listeners={{
										tabPress: e => onTabPress(e, 'Chat', initialState),
									}}
								/>
								<TabStack.Screen
									name="Notification"
									component={NotificationStackScreen}
									listeners={{
										tabPress: e => onTabPress(e, 'Notification', initialState),
									}}
								/>
							</TabStack.Navigator>
						)}
					</ChatDotContext.Consumer>
				</ChatDotProvider>
			)}
		</InitialStateContext.Consumer>
	);
};

const TransitionSpecMainStackOpen = {
	animation: 'spring',
	config: {
		stiffness: 1000,
		damping: 500,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 0.01,
		restSpeedThreshold: 0.01,
	},
};

const TransitionSpecPeckish = {
	animation: 'spring',
	config: {
		stiffness: 1000,
		damping: 80,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 10,
		restSpeedThreshold: 10,
	},
};

export const AppStack = () => {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen name="Main" component={TabClientStackScreen} options={{ headerShown: false }} />
			<Stack.Screen name="MediaFullScreen" options={{ headerShown: false }} component={MediaFullScreen} />
			<Stack.Screen name="VideoTrimmer"
				options={{
					headerShown: false,
					//cardOverlayEnabled: true,
					gestureEnabled: false,
					transitionSpec: {
						open: TransitionSpecMainStackOpen,
						close: TransitionSpecPeckish,
					},
				}}
				component={VideoTrimmer}
			/>
			<Stack.Screen name="CompareImagesModal" options={{ headerShown: false }} component={CompareImagesModal} />
			<Stack.Screen name="AppVersion" options={{ headerShown: false, gestureEnabled: false }} component={AppVersion} />
		</Stack.Navigator>
	);
};
