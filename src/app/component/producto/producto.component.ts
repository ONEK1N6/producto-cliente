import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { Producto } from '../../models/producto';
import { Cliente } from '../../models/cliente';
import { ProductoService } from '../../service/producto.service';
import { ClienteService } from '../../service/cliente.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    HomeComponent,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  titulo: string = '';
  opc: string = '';
  producto = new Producto();
  op = 0;
  visible: boolean = false;

  constructor(
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarProductos();
    this.listarClientes();
  }

  listarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de productos' })
    });
  }

  listarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de clientes' })
    });
  }

  showDialogCreate() {
    this.titulo = 'Crear Producto';
    this.opc = 'Guardar';
    this.op = 0;
    this.producto = new Producto();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Producto';
    this.opc = 'Editar';
    this.productoService.getProductoById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.op = 1;
        this.visible = true;
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el producto' })
    });
  }

  onSelectCliente(event: any) {
    const clienteId = event.value;
    const clienteSeleccionado = this.clientes.find(cliente => cliente.id === clienteId);
    if (clienteSeleccionado) {
      this.producto.cliente = clienteSeleccionado; // Asigna solo el ID del cliente
    }
  }

  confirmSaveProducto() {
    this.confirmationService.confirm({
      message: this.op === 0 ? '¿Estás seguro de que deseas agregar este producto?' : '¿Estás seguro de que deseas editar este producto?',
      header: 'Confirmar Acción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.opcion();
      },
    });
  }

  confirmDeleteProducto(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este producto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Producto Eliminado',
            });
            this.listarProductos();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el producto',
            });
          },
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addProducto();
    } else if (this.op == 1) {
      this.editProducto();
    }
  }

  addProducto(): void {
    this.productoService.createProducto(this.producto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Producto Registrado',
        });
        this.listarProductos();
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el producto',
        });
      },
    });
  }

  editProducto() {
    this.productoService.updateProducto(this.producto, this.producto.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Producto Editado',
        });
        this.listarProductos();
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el producto',
        });
      },
    });
  }
}
