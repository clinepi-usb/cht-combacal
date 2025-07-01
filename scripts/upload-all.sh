# Uploads all resources
#cht --url=https://medic:password@localhost --accept-self-signed-certs

# Optionally, you can execute separate parts of the upload process:
 cht --url=https://medic:password@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
 cht --url=https://medic:password@localhost --accept-self-signed-certs convert-app-forms upload-app-forms
 cht --url=https://medic:password@localhost --accept-self-signed-certs convert-contact-forms upload-contact-forms
 cht --url=https://medic:password@localhost --accept-self-signed-certs upload-resources
 cht --url=https://medic:password@localhost --accept-self-signed-certs upload-custom-translations
