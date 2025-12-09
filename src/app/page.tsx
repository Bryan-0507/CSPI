"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()

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
        description: "Credenciales Incorrectas",
      });
      setIsLoading(false);
      return;
    }

    toast.success("¡Bienvenido!", {
      description: "Has iniciado sesión correctamente",
    });

    // “Token” de sesión sencillo
    if (typeof window !== "undefined") {
      localStorage.setItem("cspi_session", "true");
    }

    // Redirigir al área autenticada
    router.push("/promissory");

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
            <div className="flex w-full items-center justify-center px-0">
              <svg
                width="902"
                height="360"
                viewBox="0 0 902 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-auto mb-4"
                aria-label="CSPI"
                role="img"
              >
                <path d="M357.11 118.02L196.21 26.38L49.41 112.35C48.85 112.77 47.8 114.27 47.8 114.74V335.46H343.06V162.54L195.43 79.95L75.92 150.83V124.59L196.21 53.56L387.11 159.27V186.45L366.49 176.14V357.5C366.49 357.79 367.68 358.22 367.43 358.91H23.43V127.41L0 140.53V112.41C1.62 112.27 3.01 111.5 4.38 110.7C67.98 73.67 131.44 36.38 195.42 0C249.62 30.22 303.54 60.97 357.11 92.25V118.02Z" fill="#72D5D4"/>
                <path d="M109.66 259.54C108.75 258.45 104.3 263.43 103.55 264.21C100.85 267.03 95.8502 272.88 93.8902 276.11C88.4902 285.02 87.9002 303.96 74.0102 300.33C61.2702 297.01 68.2802 279.78 71.7302 271.75C82.2802 247.15 103.96 234.23 128.63 226.48C159.69 216.72 164.79 220.62 184.88 191.81C187.58 187.94 186.93 184.56 192.15 182.21C196.58 180.21 201.18 180.1 204.86 183.57C211.07 193.06 216.87 203.2 225.46 210.77C239.2 222.89 259.48 223.33 276.5 230.02C298.13 238.52 317.32 253.58 324.98 276.21C327.5 283.66 331.66 295.81 321.88 299.74C307.04 305.71 305.81 283.09 299.22 273.85C297.05 270.81 292.33 265.53 289.66 262.79C288.39 261.49 286.98 259.39 284.95 259.53V301.71H229.65V250.63C229.65 249.21 225.25 240.12 224.02 238.45C219.99 232.96 212.69 228.57 207.59 223.95C204.22 220.9 200.76 217.4 198.23 213.6C195.81 213.61 192.25 219.76 190.3 221.6C184.65 226.94 173.95 233.12 170.03 239.29C169.21 240.58 164.97 250.81 164.97 251.57V301.71H111.07C110.97 301.71 109.66 300.4 109.66 300.3V259.53V259.54Z" fill="#606060"/>
                <path d="M133.8 168.88C159.28 165.38 169.32 200.63 146.26 211.32C115.63 225.52 101.34 173.34 133.8 168.88Z" fill="#606060"/>
                <path d="M253.76 168.86C285.24 164.09 288.75 212.37 258.18 213.65C231.43 214.77 227.23 172.88 253.76 168.86Z" fill="#606060"/>
                <path d="M462.14 199.53L457.34 204.18C453.73 199.86 448.26 197.19 441.98 197.19C430.52 197.19 421.86 205.49 421.86 217.72C421.86 229.95 430.53 238.26 441.69 238.26C452.85 238.26 458.88 232.09 459.88 221.89H444.26V215.79H466.99C467.03 216.35 467.07 216.91 467.07 217.43C467.07 232.57 457.47 244.51 441.7 244.51C428.05 244.51 415.03 234.73 415.03 217.72C415.03 202.06 426.53 190.9 442 190.9C450.26 190.9 457.44 194.14 462.16 199.53H462.14Z" fill="#606060"/>
                <path d="M499.59 191.68C511.34 191.68 517.82 196.96 517.82 206.45C517.82 215.94 510.79 221.29 499.63 221.29H499.22L517.56 243.76H509.45L491.56 221.29H485.46V243.76H478.91V191.68H499.59ZM485.45 197.82V215.34H499.44C507.1 215.34 511.01 212.29 511.01 206.45C511.01 200.61 506.99 197.82 499.44 197.82H485.45Z" fill="#606060"/>
                <path d="M571.87 223.34C571.87 237.55 562.27 244.51 550.26 244.51C538.25 244.51 528.65 237.55 528.65 223.34V191.68H535.2V222.85C535.2 233.53 541.56 238.21 550.27 238.21C558.98 238.21 565.3 233.52 565.3 222.85V191.68H571.88V223.34H571.87Z" fill="#606060"/>
                <path d="M592.5 222.93V243.76H585.95V191.68H605.74C617.5 191.68 624.16 197.56 624.16 207.3C624.16 217.04 617.5 222.92 605.74 222.92H592.5V222.93ZM592.5 197.86V216.76H605.59C613.29 216.76 617.35 213.64 617.35 207.31C617.35 200.98 613.29 197.86 605.59 197.86H592.5Z" fill="#606060"/>
                <path d="M686.39 217.72C686.39 233.31 675.04 244.54 659.42 244.54C643.8 244.54 632.45 233.31 632.45 217.72C632.45 202.13 643.8 190.9 659.42 190.9C675.04 190.9 686.39 202.13 686.39 217.72ZM639.3 217.72C639.3 229.96 647.97 238.26 659.42 238.26C670.87 238.26 679.55 229.96 679.55 217.72C679.55 205.48 670.88 197.19 659.42 197.19C647.96 197.19 639.3 205.49 639.3 217.72Z" fill="#606060"/>
                <path d="M505.48 286.96L483.07 299.33C478.55 291.62 471.64 287.56 462.59 287.56C449.69 287.56 440.12 297.4 440.12 311.63C440.12 327.52 451.16 335.7 462.66 335.7C471.5 335.7 478.62 331.71 483.67 324L504.41 338.49C495.63 351.65 481.41 359.9 462.99 359.9C434.2 359.9 413.86 339.96 413.86 311.63C413.86 283.3 434.2 263.36 462.99 263.36C481.21 263.36 497.36 272.07 505.47 286.96H505.48Z" fill="#72D5D4"/>
                <path d="M606.94 311.63C606.94 339.42 586.53 359.9 557.74 359.9C528.95 359.9 508.54 339.42 508.54 311.63C508.54 283.84 528.95 263.36 557.74 263.36C586.53 263.36 606.94 283.84 606.94 311.63ZM534.8 311.63C534.8 325.86 544.17 335.7 557.74 335.7C571.31 335.7 580.68 325.86 580.68 311.63C580.68 297.4 571.31 287.56 557.74 287.56C544.17 287.56 534.8 297.4 534.8 311.63Z" fill="#72D5D4"/>
                <path d="M685.66 324.32H642.18V358.16H616.92V265.08H688.99V287.55H642.19V301.84H685.67V324.31L685.66 324.32Z" fill="#72D5D4"/>
                <path d="M787.58 358.16H760.79L754.61 340.41H719.84L713.72 358.16H687.33L722.57 265.08H752.35L787.59 358.16H787.58ZM727.68 317.88H746.76L737.25 290.36L727.68 317.88Z" fill="#72D5D4"/>
                <path d="M901.93 358.16H876.67V299.92L861.71 349.52H834.78L819.82 299.92V358.16H794.56V265.08H829.6L848.28 321.06L866.9 265.08H901.94V358.16H901.93Z" fill="#72D5D4"/>
              </svg>
            </div>
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
                  {isLoading ? "Validando..." : "Iniciar sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}