
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: string;
  prioridad: 'Baja' | 'Media' | 'Alta';
  estado: 'Pendiente' | 'En proceso' | 'Resuelto';
  fechaRegistro: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly apiUrl = 'http://localhost:3000/api/tickets';

  tickets: Ticket[] = [];
  mostrarFormulario = false;
  cargando = false;
  mensajeError = '';
  ticketEditandoId: number | null = null;

  formulario = this.formularioVacio();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  formularioVacio(): Omit<Ticket, 'id' | 'fechaRegistro'> {
    return {
      asunto: '',
      solicitante: '',
      descripcion: '',
      categoria: '',
      prioridad: 'Media',
      estado: 'Pendiente',
    };
  }

  cargarTickets(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.http.get<Ticket[]>(this.apiUrl).subscribe({
      next: (datos) => {
        this.tickets = datos;
        this.cargando = false;
      },
      error: () => {
        this.mensajeError =
          'No se pudieron cargar los tickets. Comprueba que el backend esté funcionando.';
        this.cargando = false;
      },
    });
  }

  contarEstado(estado: Ticket['estado']): number {
    return this.tickets.filter((ticket) => ticket.estado === estado).length;
  }

  nuevoTicket(): void {
    this.ticketEditandoId = null;
    this.formulario = this.formularioVacio();
    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.ticketEditandoId = null;
    this.formulario = this.formularioVacio();
    this.mensajeError = '';
  }

  guardarTicket(): void {
    if (
      !this.formulario.asunto.trim() ||
      !this.formulario.solicitante.trim() ||
      !this.formulario.descripcion.trim() ||
      !this.formulario.categoria.trim()
    ) {
      this.mensajeError = 'Completa todos los campos obligatorios.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const datos = {
      ...this.formulario,
      asunto: this.formulario.asunto.trim(),
      solicitante: this.formulario.solicitante.trim(),
      descripcion: this.formulario.descripcion.trim(),
      categoria: this.formulario.categoria.trim(),
    };

    if (this.ticketEditandoId !== null) {
      this.http
        .put<Ticket>(`${this.apiUrl}/${this.ticketEditandoId}`, datos)
        .subscribe({
          next: () => {
            this.cancelarFormulario();
            this.cargarTickets();
          },
          error: (error) => {
            this.mensajeError =
              error.error?.error || 'No se pudo actualizar el ticket.';
            this.cargando = false;
          },
        });
    } else {
      this.http.post<Ticket>(this.apiUrl, datos).subscribe({
        next: () => {
          this.cancelarFormulario();
          this.cargarTickets();
        },
        error: (error) => {
          this.mensajeError =
            error.error?.error || 'No se pudo crear el ticket.';
          this.cargando = false;
        },
      });
    }
  }

  editarTicket(ticket: Ticket): void {
    this.ticketEditandoId = ticket.id;
    this.formulario = {
      asunto: ticket.asunto,
      solicitante: ticket.solicitante,
      descripcion: ticket.descripcion,
      categoria: ticket.categoria,
      prioridad: ticket.prioridad,
      estado: ticket.estado,
    };
    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  cambiarEstado(ticket: Ticket, estado: string): void {
    const estados: Ticket['estado'][] = [
      'Pendiente',
      'En proceso',
      'Resuelto',
    ];

    if (!estados.includes(estado as Ticket['estado'])) {
      this.cargarTickets();
      return;
    }

    this.http
      .put<Ticket>(`${this.apiUrl}/${ticket.id}`, {
        asunto: ticket.asunto,
        solicitante: ticket.solicitante,
        descripcion: ticket.descripcion,
        categoria: ticket.categoria,
        prioridad: ticket.prioridad,
        estado,
      })
      .subscribe({
        next: () => this.cargarTickets(),
        error: () => {
          this.mensajeError = 'No se pudo cambiar el estado del ticket.';
          this.cargarTickets();
        },
      });
  }

  eliminarTicket(id: number): void {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el ticket #${id}?`,
    );

    if (!confirmar) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.cargarTickets(),
      error: (error) => {
        this.mensajeError =
          error.error?.error || 'No se pudo eliminar el ticket.';
        this.cargando = false;
      },
    });
  }
}
