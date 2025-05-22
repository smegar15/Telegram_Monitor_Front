const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Panel de Administrador</h1>
      <p className="text-xl text-muted-foreground">
        Bienvenido, Administrador. Aquí gestionarás usuarios, clientes y asignaciones.
      </p>
      {/* TODO: Add Admin specific components and layout */}
    </div>
  );
};

export default AdminDashboard;