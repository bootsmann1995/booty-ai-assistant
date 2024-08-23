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
      if (newUser.data.user) {
        const { data, error } = await supabase.from("userinfo").insert([
          {
            id: newUser.data.user?.id,
            data: newUser.data.user.user_metadata,
          },
        ] as any);
        if (error) {
          throw error;
        }
      }
      return { ...newUser };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const fetchedUser = await supabase.auth.getUser();
      if (fetchedUser.data?.user) {
        const databaseUser = await supabase
          .from("userinfo")
          .select("*")
          .eq("id", fetchedUser.data.user.id);
        user.value = fetchedUser.data.user;
        if (databaseUser.data) {
          return {
            ...fetchedUser.data.user,
            database: databaseUser.data[0],
          };
        } else {
          return fetchedUser.data.user;
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const updateUser = async (data: any) => {
    try {
      const fetchedUser = await supabase.auth.getUser();
      if (fetchedUser.data?.user) {
       const {error} = await supabase
          .from("userinfo")
          .update({ data } as never)
          .eq("id", fetchedUser.data.user.id);

          if(error) {
            throw error}
      } 
      return await getUser()
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
