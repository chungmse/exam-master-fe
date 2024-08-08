'use client';

import axios, { endpoints } from 'src/utils/axios';
import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }: SignInParams): Promise => {
  try {
    const params = { username, password };
    const res = await axios.post(endpoints.auth.signIn, params);
    const { err, msg, accessToken } = res.data;
    if (err || !accessToken) {
      throw new Error(msg);
    }
    setSession(accessToken);
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
