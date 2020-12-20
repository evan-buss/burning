import React, { ReactFragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { isAuthenticatedSelector } from "../store/slices/userSlice";

interface Props {
  children: ReactFragment;
  [x: string]: any;
}

const PrivateRoute: React.FC<Props> = ({ children, ...rest }) => {
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
