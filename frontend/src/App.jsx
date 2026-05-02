import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useOfflineSync } from "./hooks/useOfflineSync";

const App = () => {
  useOfflineSync();
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <AppRoutes />
    </div>
  );
};

export default App;
