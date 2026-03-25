resource "auth0_connection" "staff" {
  name     = "grove-staff-${var.environment}"
  strategy = "auth0"

  options {
    password_policy        = "good"
    brute_force_protection = true
    disable_signup         = true # Staff are invited, never self-register
    requires_username      = false

    password_complexity_options {
      min_length = 12
    }
  }
}
