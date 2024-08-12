    import React from 'react';
    import Link from 'next/link';
    
type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

      return (
        <div className="flex flex-col min-h-screen">
          <header className="bg-[--zomp] text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                <Link href="/">Text2Sound</Link>
              </h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="hover:underline">Início
                    </Link>
                  </li>
                  <li>
                    <Link href="/historico" className="hover:underline">Histórico
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
    
          <main className="container mx-auto flex-grow px-4 py-8">
            {children}
          </main>
    
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
              <p>&copy; {new Date().getFullYear()} Text2Sound - Todos os direitos reservados.</p>
              <p>
                Desenvolvido por <a href="https://github.com/ribeirojer" target='_blank' className="text-[--yellow-green] hover:underline">José Eduardo</a>
              </p>
            </div>
          </footer>
        </div>
      );
    }
    
export default Layout