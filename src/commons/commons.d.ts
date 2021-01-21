declare namespace commons {
  interface Job {
    (): void;
  }
  interface Jobs {
    [key: string]: Job;
  }
}
