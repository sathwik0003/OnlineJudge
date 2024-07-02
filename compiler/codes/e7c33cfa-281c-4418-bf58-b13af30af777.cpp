#include <iostream>
using namespace std;

int main() {
    int a,b;
    cin>>a>>b;
    if(a<0){
      a = -1*a;
    }
    if(b<0){
      b = -1*b;
    }
    cout<<a+b;
    return 0;
}