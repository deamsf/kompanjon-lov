
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Organization from "@/pages/Organization";
import Agenda from "@/pages/Agenda";
import Todo from "@/pages/Todo";
import Planning from "@/pages/Planning";
import Documents from "@/pages/Documents";
import Bills from "@/pages/Bills";
import Offers from "@/pages/Offers";
import Photos from "@/pages/Photos";
import Partners from "@/pages/Partners";
import Communication from "@/pages/Communication";
import Advice from "@/pages/Advice";
import ProjectSettings from "@/pages/ProjectSettings";
import ProjectSelection from "@/pages/ProjectSelection";
import Index from "@/pages/Index";
import Preferences from "@/pages/Preferences";
import Account from "@/pages/Account";
import Shares from "@/pages/Shares";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organization"
        element={
          <ProtectedRoute>
            <Organization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <ProtectedRoute>
            <Agenda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planning"
        element={
          <ProtectedRoute>
            <Planning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <Bills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <Offers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/photos"
        element={
          <ProtectedRoute>
            <Photos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shares"
        element={
          <ProtectedRoute>
            <Shares />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partners"
        element={
          <ProtectedRoute>
            <Partners />
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <Communication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advice"
        element={
          <ProtectedRoute>
            <Advice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-settings"
        element={
          <ProtectedRoute>
            <ProjectSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-selection"
        element={
          <ProtectedRoute>
            <ProjectSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preferences"
        element={
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
