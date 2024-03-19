import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Función que verifica si el usuario está autenticado
function isAuthenticated(request: NextRequest): boolean {
  // Aquí deberías implementar la lógica de autenticación adecuada
  // Esto es solo un ejemplo simplificado
  return !!request.cookies.get('token'); // Suponiendo que hay un token almacenado en las cookies
}

export function middleware(request: NextRequest) {

  const {pathname} = request.nextUrl
  console.log(pathname)
  // Verifica si la ruta comienza con "/modulos/" y si el usuario no está autenticado
  if (request.nextUrl.pathname.startsWith('/modulos/') && !isAuthenticated(request)) {
    // Redirige al usuario a la página de inicio de sesión
    // return NextResponse.redirect('http://localhost:3001/');
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verifica si la cookie 'token' existe y el usuario intenta acceder a la ruta raíz ('/')
  if (isAuthenticated(request) && request.nextUrl.pathname === '/') {
    // Redirige al usuario a una página diferente, como la página principal de la aplicación
    // return NextResponse.redirect('http://localhost:3001/modulos/modulo1');
    return NextResponse.redirect(new URL("/modulos/modulo1", request.url));

  }

  // Si el usuario accede a la ruta "/modulos", redirígelo a "/modulos/modulo1"
  if (request.nextUrl.pathname === '/modulos') {
    // return NextResponse.redirect('http://localhost:3001/modulos/modulo1');
    return NextResponse.redirect(new URL("/modulos/modulo1", request.url));

  }

  // Si el usuario está autenticado o la ruta no comienza con "/modulos/",
  // permite que la solicitud continúe sin modificarla
  return NextResponse.next();
}
