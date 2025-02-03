export interface ClientLogo {
  name: string;
  image: string;
  url?: string;
}

export interface ClientLogosProps {
  logos?: ClientLogo[];
}