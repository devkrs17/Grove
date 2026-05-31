// Blinkers email / drops band — ports the mock's .email lime band.
// Heading + sub on the left, email input + dark submit on the right.
// Server component: renders a real <form> (no client JS); wire `action`
// to a newsletter endpoint when adopted.

export interface EmailBandProps {
  heading: string;
  sub: string;
  /** Submit button label. */
  cta: string;
  /** Form POST target. Defaults to "#" (no-op until wired). */
  action?: string;
  placeholder?: string;
}

export function EmailBand({ heading, sub, cta, action = "#", placeholder = "you@email.com" }: EmailBandProps) {
  return (
    <div className="email">
      <div className="email__in">
        <div>
          <h2>{heading}</h2>
          <p>{sub}</p>
        </div>
        <form className="email__form" action={action} method="post">
          <input type="email" name="email" placeholder={placeholder} aria-label="email" />
          <button className="btn btn--dark" type="submit">
            {cta}
          </button>
        </form>
      </div>
    </div>
  );
}
