# cht-combacal
CHT configuration for ComBaCaL project.
## Overview
This repository contains the CHT configuration of the ComBaCaL CHT mhealth application. Learn more about the ComBaCaL project [here](https://www.combacal.org/).
## Setup
To run the CHT application locally, you must first set up the Community Health Toolkit (CHT) and ensure all necessary resources are installed.
Before you begin, make sure you have the following installed:

- [Git](https://git-scm.com/) or GitHub Desktop
- [Docker Desktop](https://www.docker.com/products/docker-desktop)  
  → Enable **Docker Compose V2** in Docker settings  
- (Optional) [Visual Studio Code](https://code.visualstudio.com/)  
  → Install the **Dev Containers** extension if using VS Code
  
### Installation Steps
- Start by cloning the cht-core repository.
- Open a terminal, go to the cht-core directory and confirm that the docker-compose.yml file is present. 
- Run: `docker-compose up`.
- After the setup completes, open a web browser and go to https://localhost/.
- Log in using the default credentials:
  - Username: medic
  - Password: password

### Full Documentation
- The full documenation for installing CHT locally can be found [here](https://docs.communityhealthtoolkit.org/building/local-setup/).

## Upload Data

To upload the ComBaCaL config data to your local CHT instance, follow these steps:

- Clone this repository: `git clone https://github.com/clinepi-usb/cht-combacal.git`
- Navigate into the directory: `cd cht-core/config/cht-combacal-main-trial-config-code`
- Run the following cht-conf commands to connect to your local CHT instance and upload demo data:
  - `cht --url=https://medic:password@localhost --accept-self-signed-certs`
  - `cht --url=https://medic:password@localhost --accept-self-signed-certs csv-to-docs upload-docs`





