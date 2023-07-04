#Commando 
python rnn_gan.py --model "model10" --datadir "data" --traindir "results\model10" --select_validation_percentage "16" --select_test_percentage "20" --bidirectional_d --learning_rate 0.2 --hidden_size 150 --hidden_size_g 150 --hidden_size_d 150 --tones_per_cell 4 --batch_size 30 --keep_prob 0.7 --init_scale 0.03 --initialize_d --adam
