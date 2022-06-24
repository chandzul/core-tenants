import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tenancy {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;
}
