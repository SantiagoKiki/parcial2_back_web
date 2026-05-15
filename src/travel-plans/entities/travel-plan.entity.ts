import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Interfaz que representa un gasto embebido dentro de un TravelPlan.
 * No es una tabla separada; se serializa como JSON en la columna expenses.
 */
export interface Expense {
  description: string;
  amount: number;
  category: string;
}

/**
 * Entidad TravelPlan — representa un plan de viaje registrado.
 * Se relaciona con Country mediante el código Alpha-3 (FK).
 * Se vincula con User mediante userId para trazabilidad.
 */
@Entity('travel_plans')
export class TravelPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  /** Código Alpha-3 del país destino (ej. "COL") */
  @Column({ length: 3 })
  countryCode: string;

  /** ID del usuario propietario del plan */
  @Column()
  userId: string;

  /**
   * Array de gastos embebidos serializado como JSON en la BD.
   * No requiere tabla adicional; cada gasto tiene description, amount y category.
   */
  @Column({ type: 'simple-json', default: '[]' })
  expenses: Expense[];

  /**
   * Relación con la entidad Country.
   * Se carga bajo demanda (LAZY no usado; usamos JOIN explícito en queries).
   */
  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'countryCode', referencedColumnName: 'alpha3Code' })
  country: Country;

  /**
   * Relación con la entidad User.
   * Cada TravelPlan pertenece a un usuario.
   */
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
