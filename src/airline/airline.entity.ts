import { AirportEntity } from '../airport/airport.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  foundationDate: string;

  @Column()
  website: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.airlines)
  airports: AirportEntity[];
}
