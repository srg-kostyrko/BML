interface Person {
  public String identify(String name);
}

class Student implements Person {
  class SubClass {
  }

  private Student() {
  }

  public String identify(String name) {
    return name;
  }
}

// Class Declaration
class Test {
  public static void main(String[] args) {
    System.out.println("Class File Structure");
  }
}