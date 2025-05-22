import React from 'react';

const ManageClientsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Gestionar Clientes</h2>
      <p className="text-muted-foreground">
        Aquí podrás ver, crear, editar y eliminar clientes.
      </p>
      {/* TODO: Implement table and CRUD operations for clients */}
    </div>
  );
};

export default ManageClientsPage;