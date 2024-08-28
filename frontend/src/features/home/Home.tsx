import Button from "@shared/components/primitives/Button";
import { supabase } from "@shared/context/AuthProvider";
import { useTheme } from "@shared/context/ThemeProvider";

const Home = () => {
  const { handleShowThemePanel } = useTheme();

  return (
    <div className="flex h-screen w-screen flex-col gap-rx-3 p-rx-3">
      <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
      <Button onClick={handleShowThemePanel}>Theme</Button>
    </div>
  );
};

export default Home;
