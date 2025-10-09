export type RootStackParamList = {
  Home: undefined;
  Chat: {
    threadId: string;
  };
};

export type ChatRouteParams = RootStackParamList['Chat'];
