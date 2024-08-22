export interface SupabaseSignUpModel {
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface SupabaseSignInModel {
  email: string;
  password: string;
  redirectTo?: string;
}

export const useSupabaseFunc = () => {
  const supabase = useSupabaseClient();
  const user = useState("user");

  const login = async (user: SupabaseSignInModel) => {
    try {
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });
      navigateTo(user.redirectTo);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const signUp = async (user: SupabaseSignUpModel) => {
    try {
      const newUser = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.first_name,
            last_name: user.last_name,
          },
        },
      });
      return newUser;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const fetchedUser = await supabase.auth.getUser();
      user.value = fetchedUser.data.user;
      return fetchedUser.data.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const updateUser = async (data: any) => {
    try {
      const updatedUser = await supabase.auth.updateUser({ data });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return {
    login,
    updateUser,
    signUp,
    getUser,
    user,
  };
};
