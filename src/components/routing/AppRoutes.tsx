import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Files from "@/pages/Files";
import Documents from "@/pages/Documents";
import Bills from "@/pages/Bills";
import Offers from "@/pages/Offers";
import Photos from "@/pages/Photos";
import Agenda from "@/pages/Agenda";
import Planning from "@/pages/Planning";
import Todo from "@/pages/Todo";
import Communication from "@/pages/Communication";
import Partners from "@/pages/Partners";
import Advice from "@/pages/Advice";
import Preferences from "@/pages/Preferences";
import ProjectSettings from "@/pages/ProjectSettings";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
        path="/agenda"
        element={
          <ProtectedRoute>
            <Agenda />
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
        path="/todo"
        element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Communication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Partners />
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
        path="/preferences"
        element={
          <ProtectedRoute>
            <Preferences />
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
    </Routes>
  );
};
