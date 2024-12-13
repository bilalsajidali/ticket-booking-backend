import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column({nullable:true})
  price: number;

  @Column({nullable:true})
  imageUrl: string;

  @Column()
  location: string;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
