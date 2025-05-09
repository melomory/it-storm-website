import { NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-header",
  imports: [RouterLink, RouterLinkActive, NgIf, MatMenuModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  isLoggedIn = false;

  /**
   * Logs the user out.
   */
  logout() {
    // TODO
  }
}
