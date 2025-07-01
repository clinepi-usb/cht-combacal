if [ -f ../.env ]
then
  export $(cat ../.env | sed 's/#.*//g' | xargs)
fi

ssh -i "../combacal.pem" ubuntu@$EC2_PROD
