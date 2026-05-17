import { Role, User } from '../models/user.model';
import { Product, ProductStatus } from '../models/product.model';
import { Category } from '../models/category.model';
import { Supplier } from '../models/supplier.model';
import { InventoryMovement, MovementType } from '../models/inventory-movement.model';
import { AppNotification, NotificationType } from '../models/notification.model';
import { DashboardData } from '../models/dashboard.model';

export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@inventario.com', name: 'Carlos Admin', role: Role.ADMIN, avatar: '', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', email: 'manager@inventario.com', name: 'María Manager', role: Role.INVENTORY_MANAGER, avatar: '', isActive: true, createdAt: '2024-01-15T00:00:00Z' },
  { id: '3', email: 'employee@inventario.com', name: 'José Employee', role: Role.EMPLOYEE, avatar: '', isActive: true, createdAt: '2024-02-01T00:00:00Z' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Electrónicos', description: 'Dispositivos y componentes electrónicos', productCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c2', name: 'Muebles', description: 'Muebles de oficina y hogar', productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c3', name: 'Oficina', description: 'Suministros de oficina', productCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c4', name: 'Herramientas', description: 'Herramientas manuales y eléctricas', productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c5', name: 'Seguridad', description: 'Equipos de seguridad industrial', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c6', name: 'Limpieza', description: 'Productos de limpieza', productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c7', name: 'Iluminación', description: 'Sistemas de iluminación', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c8', name: 'Climatización', description: 'Equipos de clima', productCount: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c9', name: 'Cómputo', description: 'Equipos de cómputo', productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'c10', name: 'Audio y Video', description: 'Equipos de audio y video', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Distribuidora Nacional S.A.', contactName: 'Roberto Díaz', email: 'roberto@dnacional.com', phone: '555-0101', address: 'Av. Principal 123', productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's2', name: 'Importadora Global', contactName: 'Ana López', email: 'ana@iglobal.com', phone: '555-0102', address: 'Blvd. Internacional 456', productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's3', name: 'TecnoSuministros', contactName: 'Pedro García', email: 'pedro@tecsun.com', phone: '555-0103', address: 'Calle Tecnología 789', productCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's4', name: 'Industrial Martínez', contactName: 'Laura Martínez', email: 'laura@indmart.com', phone: '555-0104', address: 'Av. Industrial 321', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's5', name: 'Proveedora Office', contactName: 'Jorge Ramírez', email: 'jorge@proffice.com', phone: '555-0105', address: 'Calle Oficina 654', productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's6', name: 'Equipos y Servicios', contactName: 'Sofía Torres', email: 'sofia@eqys.com', phone: '555-0106', address: 'Av. Equipos 987', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's7', name: 'Distribuidora del Sur', contactName: 'Miguel Ángel', email: 'miguel@delsur.com', phone: '555-0107', address: 'Calle Sur 147', productCount: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's8', name: 'Suministros Industriales', contactName: 'Carmen Vega', email: 'carmen@sumind.com', phone: '555-0108', address: 'Av. Industrial 258', productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Laptop Pro 15"', sku: 'LAP-001', description: 'Laptop profesional 15 pulgadas', price: 24999.99, stock: 15, minStock: 5, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c9', supplierId: 's1', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p2', name: 'Monitor 27" 4K', sku: 'MON-001', description: 'Monitor 4K UHD 27 pulgadas', price: 8999.99, stock: 8, minStock: 3, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c9', supplierId: 's3', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p3', name: 'Teclado Mecánico RGB', sku: 'TEC-001', description: 'Teclado mecánico con retroiluminación RGB', price: 1899.99, stock: 25, minStock: 10, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c9', supplierId: 's3', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p4', name: 'Mouse Inalámbrico', sku: 'MOU-001', description: 'Mouse ergonómico inalámbrico', price: 899.99, stock: 30, minStock: 10, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c9', supplierId: 's3', createdAt: '2024-02-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p5', name: 'Escritorio Ejecutivo', sku: 'MUE-001', description: 'Escritorio ejecutivo de madera', price: 5499.99, stock: 3, minStock: 2, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c2', supplierId: 's4', createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p6', name: 'Silla Ergonómica', sku: 'MUE-002', description: 'Silla de oficina ergonómica', price: 7899.99, stock: 2, minStock: 3, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c2', supplierId: 's4', createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p7', name: 'Router WiFi 6', sku: 'NET-001', description: 'Router WiFi 6 de doble banda', price: 2499.99, stock: 12, minStock: 5, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c1', supplierId: 's2', createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p8', name: 'Switch 24 Puertos', sku: 'NET-002', description: 'Switch Gigabit 24 puertos', price: 4599.99, stock: 6, minStock: 3, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c1', supplierId: 's2', createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p9', name: 'Cable HDMI 2m', sku: 'CAB-001', description: 'Cable HDMI 2.1 de 2 metros', price: 199.99, stock: 50, minStock: 20, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c1', supplierId: 's1', createdAt: '2024-03-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p10', name: 'Cámara Seguridad IP', sku: 'SEG-001', description: 'Cámara de seguridad IP 1080p', price: 3299.99, stock: 4, minStock: 5, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c5', supplierId: 's6', createdAt: '2024-03-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p11', name: 'Taladro Percutor', sku: 'HER-001', description: 'Taladro percutor 650W', price: 2199.99, stock: 7, minStock: 3, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c4', supplierId: 's8', createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p12', name: 'Lámpara LED Escritorio', sku: 'ILU-001', description: 'Lámpara LED para escritorio', price: 699.99, stock: 20, minStock: 8, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c7', supplierId: 's5', createdAt: '2024-04-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p13', name: 'Aire Acondicionado 12K', sku: 'CLI-001', description: 'Aire acondicionado split 12000 BTU', price: 12999.99, stock: 1, minStock: 2, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c8', supplierId: 's7', createdAt: '2024-04-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p14', name: 'Proyector 4K', sku: 'AV-001', description: 'Proyector 4K 3000 lúmenes', price: 18999.99, stock: 3, minStock: 2, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c10', supplierId: 's2', createdAt: '2024-04-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p15', name: 'Kit Limpieza Oficina', sku: 'LIM-001', description: 'Kit completo de limpieza para oficina', price: 399.99, stock: 35, minStock: 15, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c6', supplierId: 's5', createdAt: '2024-05-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p16', name: 'Papel Bond Carta', sku: 'OFI-001', description: 'Resma papel bond tamaño carta 500 hojas', price: 89.99, stock: 100, minStock: 30, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c3', supplierId: 's5', createdAt: '2024-05-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p17', name: 'Toner Impresora HP', sku: 'OFI-002', description: 'Toner negro para impresora HP', price: 1299.99, stock: 8, minStock: 5, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c3', supplierId: 's1', createdAt: '2024-05-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p18', name: 'Archivero Metálico', sku: 'MUE-003', description: 'Archivero metálico 4 gavetas', price: 3899.99, stock: 5, minStock: 2, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c2', supplierId: 's4', createdAt: '2024-05-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p19', name: 'Tablet 10"', sku: 'TAB-001', description: 'Tablet Android 10 pulgadas', price: 5999.99, stock: 0, minStock: 5, imageUrl: '', status: ProductStatus.DISCONTINUED, categoryId: 'c1', supplierId: 's3', createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
  { id: 'p20', name: 'Disco SSD 1TB', sku: 'ALM-001', description: 'Disco SSD 1TB NVMe', price: 1799.99, stock: 18, minStock: 5, imageUrl: '', status: ProductStatus.ACTIVE, categoryId: 'c9', supplierId: 's3', createdAt: '2024-06-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
];

function getProductName(id: string): string {
  return MOCK_PRODUCTS.find(p => p.id === id)?.name || 'Desconocido';
}

function getUserName(id: string): string {
  return MOCK_USERS.find(u => u.id === id)?.name || 'Desconocido';
}

export const MOCK_MOVEMENTS: InventoryMovement[] = [
  { id: 'm1', productId: 'p1', type: MovementType.INCOMING, quantity: 10, description: 'Compra mensual', userId: '1', createdAt: '2024-06-01T10:00:00Z' },
  { id: 'm2', productId: 'p2', type: MovementType.INCOMING, quantity: 5, description: 'Reabastecimiento', userId: '2', createdAt: '2024-06-02T11:00:00Z' },
  { id: 'm3', productId: 'p6', type: MovementType.OUTGOING, quantity: 1, description: 'Venta directa', userId: '3', createdAt: '2024-06-03T09:00:00Z' },
  { id: 'm4', productId: 'p10', type: MovementType.INCOMING, quantity: 8, description: 'Nuevo lote', userId: '1', createdAt: '2024-06-04T14:00:00Z' },
  { id: 'm5', productId: 'p13', type: MovementType.OUTGOING, quantity: 2, description: 'Venta instalación', userId: '2', createdAt: '2024-06-05T16:00:00Z' },
  { id: 'm6', productId: 'p3', type: MovementType.ADJUSTMENT, quantity: -2, description: 'Ajuste por inventario físico', userId: '1', createdAt: '2024-06-06T08:00:00Z' },
  { id: 'm7', productId: 'p7', type: MovementType.INCOMING, quantity: 15, description: 'Compra mayorista', userId: '2', createdAt: '2024-06-07T10:00:00Z' },
  { id: 'm8', productId: 'p19', type: MovementType.OUTGOING, quantity: 5, description: 'Devolución a proveedor', userId: '1', createdAt: '2024-06-08T12:00:00Z' },
  { id: 'm9', productId: 'p16', type: MovementType.INCOMING, quantity: 50, description: 'Reabastecimiento mensual', userId: '3', createdAt: '2024-06-09T09:00:00Z' },
  { id: 'm10', productId: 'p20', type: MovementType.INCOMING, quantity: 25, description: 'Nuevo producto', userId: '2', createdAt: '2024-06-10T11:00:00Z' },
];

MOCK_MOVEMENTS.forEach(m => {
  m.productName = getProductName(m.productId);
  m.userName = getUserName(m.userId);
});

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', userId: '1', title: 'Stock Bajo', message: 'Silla Ergonómica tiene stock crítico (2 unidades)', type: NotificationType.LOW_STOCK, isRead: false, createdAt: '2024-06-10T08:00:00Z' },
  { id: 'n2', userId: '1', title: 'Stock Bajo', message: 'Cámara Seguridad IP tiene stock bajo (4 unidades)', type: NotificationType.LOW_STOCK, isRead: false, createdAt: '2024-06-09T08:00:00Z' },
  { id: 'n3', userId: '1', title: 'Movimiento Registrado', message: 'Entrada de 10 Laptop Pro 15" registrada', type: NotificationType.MOVEMENT, isRead: true, createdAt: '2024-06-01T10:05:00Z' },
  { id: 'n4', userId: '1', title: 'Movimiento Registrado', message: 'Salida de 2 Aire Acondicionado 12K registrada', type: NotificationType.MOVEMENT, isRead: true, createdAt: '2024-06-05T16:05:00Z' },
  { id: 'n5', userId: '1', title: 'Sistema', message: 'Respaldo de base de datos completado', type: NotificationType.SYSTEM, isRead: false, createdAt: '2024-06-10T02:00:00Z' },
];

export const MOCK_DASHBOARD: DashboardData = {
  totalProducts: 20,
  lowStockProducts: 4,
  inventoryValue: 1250000.00,
  monthlyMovements: 45,
  movementsByMonth: [
    { month: 'Ene', incoming: 30, outgoing: 15 },
    { month: 'Feb', incoming: 25, outgoing: 20 },
    { month: 'Mar', incoming: 40, outgoing: 18 },
    { month: 'Abr', incoming: 35, outgoing: 22 },
    { month: 'May', incoming: 45, outgoing: 25 },
    { month: 'Jun', incoming: 50, outgoing: 30 },
  ],
  productsByCategory: [
    { category: 'Cómputo', count: 5 },
    { category: 'Electrónicos', count: 4 },
    { category: 'Muebles', count: 3 },
    { category: 'Oficina', count: 2 },
    { category: 'Herramientas', count: 1 },
    { category: 'Seguridad', count: 1 },
    { category: 'Iluminación', count: 1 },
    { category: 'Climatización', count: 1 },
    { category: 'Audio y Video', count: 1 },
    { category: 'Limpieza', count: 1 },
  ],
  inventoryValueOverTime: [
    { month: 'Ene', value: 850000 },
    { month: 'Feb', value: 920000 },
    { month: 'Mar', value: 980000 },
    { month: 'Abr', value: 1050000 },
    { month: 'May', value: 1150000 },
    { month: 'Jun', value: 1250000 },
  ],
  recentActivity: MOCK_MOVEMENTS.slice(0, 5).map(m => ({
    id: m.id,
    productName: m.productName || '',
    type: m.type,
    quantity: m.quantity,
    userName: m.userName || '',
    date: m.createdAt,
  })),
};
