import { Navigate, Route, RouteProps } from "react-router";
import { useAuth } from "../../auth/contexts/AuthProvider";

const PublicRoute = ({ children, ...routeProps }: RouteProps) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    return <Route {...routeProps} />;
  } else {
    return <Navigate to={`/${process.env.PUBLIC_URL}/${userInfo.role}`} />;
  }
};

export default PublicRoute;
