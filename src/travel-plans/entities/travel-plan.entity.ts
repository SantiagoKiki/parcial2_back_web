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

/**
 * Entidad TravelPlan — representa un plan de viaje registrado.
 * Se relaciona con Country mediante el código Alpha-3 (FK).
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

  /**
   * Relación con la entidad Country.
   * Se carga bajo demanda (LAZY no usado; usamos JOIN explícito en queries).
   */
  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'countryCode', referencedColumnName: 'alpha3Code' })
  country: Country;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
