import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInData.session) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate("/files");
        return;
      }

      // If sign in fails, try to sign up
      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          if (signUpError instanceof AuthApiError) {
            throw signUpError;
          }
          throw signUpError;
        }

        if (signUpData.session) {
          toast({
            title: "Success",
            description: "Account created and logged in successfully",
          });
          navigate("/files");
        } else {
          toast({
            title: "Success",
            description: "Please check your email for verification link",
          });
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error("Auth error:", authError);
      
      let errorMessage = "An error occurred during authentication";
      
      if (authError instanceof AuthApiError) {
        switch (authError.message) {
          case "Invalid login credentials":
            errorMessage = "Invalid email or password";
            break;
          case "Email not confirmed":
            errorMessage = "Please verify your email address";
            break;
          case "Anonymous sign-ups are disabled":
            errorMessage = "Please provide a valid email and password";
            break;
          default:
            errorMessage = authError.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Enter your email and password to sign in or create an account
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;