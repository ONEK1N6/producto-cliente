import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../service/cliente.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    HomeComponent,
    TableModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent {
  clientes: Cliente[] = [];
  titulo: string = '';
  opc: string = '';
  cliente = new Cliente();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes() {
    this.clienteService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  showDialogCreate() {
    this.titulo = 'Crear Cliente';
    this.opc = 'Save';
    this.op = 0;
    this.visible = true; // Cambia la visibilidad del diálogo
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Cliente';
    this.opc = 'Editar';
    this.clienteService.getClienteById(id).subscribe((data) => {
      this.cliente = data;
      this.op = 1;
    });
    this.visible = true; // Cambia la visibilidad del diálogo
  }

  confirmDeleteCliente(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Elimina el cliente si el usuario confirma (clic en "Sí")
        this.deleteCliente(id);
      },
      reject: () => {
        // Si el usuario rechaza la confirmación (clic en "No"), muestra notificación
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Has cancelado la operación',
        });
      },
    });
  }

  deleteCliente(id: number) {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El cliente ha sido eliminado exitosamente',
        });
        this.listarClientes(); // Actualiza la lista después de la eliminación
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente',
        });
      },
    });
  }

  addCliente(): void {
    this.clienteService.createCliente(this.cliente).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Cliente Registrado',
        });
        this.listarClientes();
        this.op = 0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el cliente',
        });
      },
    });
    this.visible = false;
  }

  confirmSaveCliente() {
    this.confirmationService.confirm({
      message:
        this.op === 0
          ? '¿Estás seguro de que deseas agregar este cliente?'
          : '¿Estás seguro de que deseas editar este cliente?',
      header: 'Confirmar Acción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.opcion(); // Llama a opcion() si el usuario confirma
      },
    });
  }

  editCliente() {
    this.clienteService.updateCliente(this.cliente, this.cliente.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Cliente Editado',
        });
        this.listarClientes();
        this.op = 0;
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el cliente',
        });
      },
    });
    this.visible = false;
  }

  opcion(): void {
    if (this.op == 0) {
      this.addCliente();
      this.limpiar();
    } else if (this.op == 1) {
      this.editCliente();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.cliente.id = 0;
    this.cliente.nombre = '';
  }
}
