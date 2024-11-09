import{Cliente} from './cliente';

export class Producto {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    cliente: Cliente;
  
    constructor(
      id: number = 0,
      nombre: string = '',
      precio: number = 0,
      cantidad: number = 0,
      cliente : Cliente = {id: 0, nombre: ''}
    ) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.cantidad = cantidad;
      this.cliente = cliente;
    }
  }
  