declare namespace myCommons {
  interface Job {
    (): void;
  }
  interface Jobs {
    [key: string]: Job;
  }
}
