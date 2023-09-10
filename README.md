CloakTalk 

Introduction: 

CloakTalk is a state-of-the-art instant messaging application designed for privacy-conscious users. Built on robust architecture, this secure messaging platform ensures end-to-end encryption, real-time communication, and enhanced user experience. This synopsis report provides an overview of the CloakTalk project. 

Features: 

End-to-End Encryption: CloakTalk employs advanced encryption techniques to protect user data. It uses PBKDF2 with SHA512 digest and unique salts for user authentication. Private keys and chat messages are encrypted using AES, ensuring robust security. 

Key Exchange: Secure key exchange is achieved through ECDH, allowing two participants to generate a shared secret key for secure message encryption. 

Real-Time Communication: The application offers real-time status updates for user online/offline status using WebSockets. This feature enhances the user experience by providing instant feedback. 

Improved User Experience: CloakTalk enhances user interaction with features such as improved user searching, an Online Users tab, and sent/seen message status indicators. 

Spam Prevention: An input cooldown mechanism is implemented to combat spam and ensure a quality user experience. 

Authentication and Authorization: We will make use of JWT (JSON Web Tokens) for authorization. 

Azure Requirements: 

    Five Virtual Machines of the type BASIC_A1 to provide redundancy. 

    Azure Load Balancer to distribute the workload. 

    Azure DNS for name resolution of Load balancer endpoint. 

    Azure Bastion for secure access into the Virtual Machine. 

    Azure Monitor to generation of logs and insights into the application. 

 

 
