import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

/**
 * Entidad Country — caché local de datos geográficos.
 * Se llena bajo demanda desde la API externa RestCountries.
 */
@Entity('countries')
export class Country {
  /** Código Alpha-3 del país (ej. "COL", "USA", "FRA") — clave primaria natural */
  @PrimaryColumn({ length: 3 })
  alpha3Code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  capital: string;

  @Column({ type: 'bigint', nullable: true })
  population: number;

  @Column({ nullable: true })
  flagUrl: string;

  @CreateDateColumn()
  cachedAt: Date;
}
