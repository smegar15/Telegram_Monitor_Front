import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { mockLogin } from "@/App"; // Import mockLogin

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    if (!username || !password) {
      setError("Nombre de usuario y contraseña son requeridos.");
      showError("Nombre de usuario y contraseña son requeridos.");
      return;
    }

    if (username.toLowerCase() === "admin" && password === "adminpass") {
      mockLogin('admin'); // Use mockLogin
      showSuccess("Inicio de sesión como Admin exitoso!");
      console.log("Admin login successful, navigating to /admin/dashboard");
      navigate("/admin/dashboard", { replace: true });
    } else if (username.toLowerCase() === "analyst" && password === "analystpass") {
      mockLogin('analyst'); // Use mockLogin
      showSuccess("Inicio de sesión como Analista exitoso!");
      console.log("Analyst login successful, navigating to /analyst/dashboard");
      navigate("/analyst/dashboard", { replace: true });
    } else {
      setError("Credenciales incorrectas, por favor inténtelo de nuevo.");
      showError("Credenciales incorrectas, por favor inténtelo de nuevo.");
      console.log("Login failed for:", username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Accede al Sistema de Monitorización de Canales de Telegram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block">
          <p>Usa 'admin'/'adminpass' o 'analyst'/'analystpass' para probar.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;