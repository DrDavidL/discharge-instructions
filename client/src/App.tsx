import { useAuth } from "./auth";
import { Login } from "./components/Login";
import { Shell } from "./components/Shell";

export function App() {
  const { token } = useAuth();
  return token ? <Shell /> : <Login />;
}
