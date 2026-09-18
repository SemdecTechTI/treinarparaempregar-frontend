// Estado compartilhado do menu lateral do admin (aberto/fechado no mobile).
// Usado pelo layout (botão hambúrguer) e pelo AdminSidebar (drawer).
export const useAdminSidebar = () => useState<boolean>('admin-sidebar-open', () => false)
