"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ user?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const expectedUser = process.env.NEXT_PUBLIC_CSPI_USER;
    const expectedPassword = process.env.NEXT_PUBLIC_CSPI_PASSWORD;

    const newErrors: { user?: string; password?: string } = {};

    if (!user) {
      newErrors.user = "El usuario es requerido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user !== expectedUser || password !== expectedPassword) {
      toast.error("Error", {
        description: "Credenciales Incorrectas"
      });
    } else {
      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #72d5d4 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/cspi_full_logo.svg"
              alt="CSPI Logo"
              width={200}
              height={60}
              className="mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">
              Bienvenido de Nuevo
            </h1>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="user">Usuario</Label>
                  <Input
                    id="user"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className={errors.user ? "border-destructive" : ""}
                  />
                  {errors.user && (
                    <p className="text-sm text-destructive">{errors.user}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 transform hover:scale-110"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full hover:bg-blue-300 transition ease-in cursor-pointer duration-100 mt-4"
                  disabled={isLoading}
                >
                  Iniciar sesión
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}