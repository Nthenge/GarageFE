import { Component } from '@angular/core';
import { Header } from "../header/header";
import { HeroSection } from "../hero-section/hero-section";
import { Guide } from "../guide/guide";
import { Footer } from "../footer/footer";
import { ServicesComponent } from "../services/component";



@Component({
  selector: 'app-landing',
  imports: [Header, HeroSection, Guide, Footer, ServicesComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

  
}
