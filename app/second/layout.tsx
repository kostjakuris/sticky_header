export default function SecondLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'min-h-screen bg-black'}>
      
      {children}
    </div>
  );
}
