function [P T Test T2] = readEpi(obj, path, type)
      global h;
      switch(type)
          case 'i'
              %select data by visual inspection of the features | create feature interface
              par_file=fullfile(obj.DATA.STUDY.workspace_path,'train_cache','last_man_data_sets.mat');
              pictal_delta=obj.DATA.PRE_ICTAL_TIME;
              if exist(par_file,'file')
                  disp('last man exists')
                  dl=load(par_file)
                  sel_feat=dl.sel_feat
                  low_pass_stat=dl.low_pass_stat;
                  low_cut_off=dl.low_cut_off;
                  %prev_pictal=dl.pictal_delta;
                  %equal_class=dl.equal_class;

                  %prev_pictal=dl.i;
              else
                  disp('last man do not exists')
                  sel_feat=1;
                  low_pass_stat=0;
                  equal_class=0;
                  low_cut_off=0.1;
                  %prev_pictal=obj.DATA.PRE_ICTAL_TIME;
              end
              d_selection = MultiFeatPlot(obj.DATA.STUDY);
              d_selection.get_data_sets_idx(sel_feat,low_pass_stat,low_cut_off,pictal_delta);

              uiwait();

              %dataset selection
              try
                  [dat_train_time_start] = d_selection.data_sets.train.start*60; %time stamp minutes - seconds
                  [dat_train_time_end] = d_selection.data_sets.train.end*60; %time stamp minutes - seconds
              catch
                  dat_train_time_start=dl.dat_train_time_start;
                  dat_train_time_end=dl.dat_train_time_end;
              end

              try
                  [dat_test_time_start] = d_selection.data_sets.test.start*60; %time stamp minutes - seconds
                  [dat_test_time_end] = d_selection.data_sets.test.end*60; %time stamp minutes - seconds
               catch
                  dat_test_time_start=dl.dat_test_time_start;
                  dat_test_time_end=dl.dat_test_time_end;
              end

              try
                    equal_class=d_selection.equal_class;


               catch
                   equal_class=dl.equal_class;
              end

              try
                    low_pass_stat=d_selection.low_pass_stat;


               catch
                   low_pass_stat=dl.low_pass_stat;
               end

              p_acq = obj.DATA.STUDY.dataset.results.parameterAcq;
              obj.DATA.pAcq=p_acq;


              dat_train_time_start_idx = find(obj.DATA.STUDY.dataset.results.glbTime >=...
                  (ceil(dat_train_time_start/p_acq))*p_acq);
              dat_train_time_start_idx =dat_train_time_start_idx(1);

              dat_train_time_end_idx = find(obj.DATA.STUDY.dataset.results.glbTime >=...
                  (ceil(dat_train_time_end/p_acq))*p_acq);
              dat_train_time_end_idx = dat_train_time_end_idx(1);

              dat_test_time_start_idx = find(obj.DATA.STUDY.dataset.results.glbTime >=...
                  (ceil(dat_test_time_start/p_acq))*p_acq);

              dat_test_time_start_idx = dat_test_time_start_idx(1);


              dat_test_time_end_idx = find(obj.DATA.STUDY.dataset.results.glbTime >=...
                  (ceil(dat_test_time_end/p_acq))*p_acq);
              dat_test_time_end_idx =dat_test_time_end_idx(1);

              sel_feat=d_selection.select_feat
              sel_feat_names=d_selection.select_feat_names;
              low_pass_stat=d_selection.low_pass_stat;
              low_cut_off=d_selection.low_cut_off;
              parameterAcq=d_selection.parameterAcq;
              equal_class=d_selection.equal_class;
              evts=obj.DATA.STUDY.dataset.results.feat_events;
              ev_struct=evts;





              save(fullfile(obj.DATA.STUDY.workspace_path,'train_cache','last_man_data_sets.mat'),'dat_train_time_start','dat_train_time_end','dat_test_time_start','dat_test_time_end','pictal_delta','dat_train_time_start_idx','dat_train_time_end_idx',...
                  'dat_test_time_start_idx','dat_test_time_end_idx','sel_feat','sel_feat_names','low_pass_stat','low_cut_off','parameterAcq','equal_class','ev_struct')


              train_d_matrix=[];
              test_d_matrix=[];

              if obj.DATA.STUDY.from_raw==0%Get features from feature file



              n_loaded_files=size(obj.DATA.STUDY.dataset.file,2);



              act_tot_feat=0;
              start_feat_idx=find(d_selection.select_feat>0);


              d_selection.select_feat


              for k=1:n_loaded_files

                  f_path = fullfile(obj.DATA.STUDY.dataset.file(k).path,...
                      obj.DATA.STUDY.dataset.file(k).filename);

                  file_name=obj.DATA.STUDY.dataset.file(k).filename;




                  feat_bin_o = feat_bin_file(f_path);

                  stop_feat_idx=find(d_selection.select_feat<=(act_tot_feat+(feat_bin_o.a_n_chan*feat_bin_o.a_n_features)));

                  act_feat_idx=intersect(start_feat_idx,stop_feat_idx);

                  start_feat_idx=find(d_selection.select_feat>act_tot_feat+(feat_bin_o.a_n_chan*feat_bin_o.a_n_features));

                  act_feat=d_selection.select_feat(act_feat_idx)-act_tot_feat;

                  act_tot_feat=act_tot_feat+(feat_bin_o.a_n_chan*feat_bin_o.a_n_features);


                  % function get_matrix



                  train_d_matrix = [train_d_matrix,feat_bin_o.file2matrix(dat_train_time_start_idx, dat_train_time_end_idx,act_feat)];
                  [te_data,time]=feat_bin_o.file2matrix(dat_test_time_start_idx, dat_test_time_end_idx,act_feat);
                  test_d_matrix = [test_d_matrix,te_data];


                  feat_bin_o.delete();
                  clear feat_bin_o;


              end
